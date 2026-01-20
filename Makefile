DC = docker compose
DEV = docker-compose.dev.yml
PROD = docker-compose.yml

all: up

dev: #deps to determine correctly
	@if [ -f ".env" ]; then \
		$(DC) -f $(DEV) up --watch; \
	else \
		echo "No .env file found"; \
	fi

up: #deps to determine correctly
	@if [ -f ".env" ]; then \
		$(DC) --file $(PROD) up -d ; \
	else \
		echo "No .env file found"; \
	fi

down:
	$(DC) down

ddown:
	$(DC) -f $(DEV) down

logs:
	$(DC) logs -f

clean:
	$(DC) down --rmi all

fclean: clean
	$(DC) down -v
	docker system prune -a -f

cleand:
	$(DC) --file $(DEV) down --rmi all

fcleand: cleand
	$(DC) --file $(DEV) down -v
	docker system prune -a -f
	rm -f db_data/dev.db


red: cleand dev

refd: fcleand dev

re: clean all

ref: fclean all

.PHONY:	all dev up down clean fclean red refd re ref logs