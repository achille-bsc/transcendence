DC = docker compose
DEV = docker-compose.dev.yml
PROD = docker-compose.yml

SERVICES = database-service \
auth-service \
chat-service \
user-management-service \
kong-service \

all: up

certs:
	@mkdir -p certificates
	@for service in $(SERVICES)
		if [ ! -f certificates/$$service.crt ]; \
			then \
				openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
						-keyout certs/private/$$service.key \
						-out certs/public/$$service.crt \
						-subj "/CN=$$service" \
						-addext "subjectAltName=DNS:$$service, DNS:localhost"; \
		fi

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
	rm -rf certs/

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