DC = docker compose
DEV = docker-compose.dev.yml
PROD = docker-compose.yml

SERVICES = \
frontend \
database-service \
kong-service \
auth-service \
chat-service \
user-management-service \

all: up

certs:
	@mkdir -p certificates
	@mkdir -p certificates/public
	@mkdir -p certificates/private
	@for service in $(SERVICES); do \
		if [ ! -f certificates/private/$$service.key ] | [ ! -f certificates/public/$$service.crt ]; \
			then \
				rm -rf certificates/private/$$service.key ;\
				rm -rf certificates/public/$$service.crt ;\
				echo "Generating certificate for $$service" ;\
				echo ;\
				openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
						-keyout "./certificates/private/$$service.key" \
						-out "./certificates/public/$$service.crt" \
						-subj "/CN=$$service" \
						-addext "subjectAltName=DNS:$$service,DNS:localhost"; \
		fi \
	done

dev: certs
	@if [ -f ".env" ]; then \
		$(DC) -f $(DEV) up --watch; \
	else \
		echo "No .env file found"; \
	fi

up: certs
	@if [ -f ".env" ]; then \
		$(DC) --file $(PROD) up -d ; \
	else \
		echo "No .env file found"; \
	fi

down:
	$(DC) down

ddown:
	$(DC) -f $(DEV) down

clean-certs:
	rm -rf certificates/

clean:
	$(DC) down --rmi local

fclean: clean-certs
	$(DC) down -v --rmi all
# 	docker system prune -a -f

cleand: 
	$(DC) --file $(DEV) down --rmi local

fcleand: clean-certs
	$(DC) --file $(DEV) down -v --rmi all
# 	docker system prune -a -f


red: cleand dev

refd: fcleand dev

re: clean all

ref: fclean all

.PHONY:	all dev up down clean fclean red refd re ref logs certs clean-certs
