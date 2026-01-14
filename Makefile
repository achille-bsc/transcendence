DC = docker compose
DEV = docker-compose.dev.yml
PROD = docker-compose.yml

all: up

dev: #deps to determine correctly
	$(DC) up --build -d -f $(DEV)

up: #deps to determine correctly
	$(DC) up --build -d -f $(PROD)

down:
	$(DC) down

logs:
	$(DC) logs -f

clean:
	$(DC) down --rmi all

fclean: clean
	$(DC) down -v
	docker system prune -a -f

red: clean dev

refd: fclean dev

re: clean all

ref: fclean all

.PHONY:	all dev up down clean fclean red refd re ref logs