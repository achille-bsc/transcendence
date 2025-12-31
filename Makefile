DC = docker compose

all: up

up: #deps to determine correctly
	$(DC) up --build -d

down:
	$(DC) down

logs:
	$(DC) logs -f

clean:
	$(DC) down --rmi all

fclean: clean
	$(DC) down -v
	docker system prune -a -f

re: clean all

ref: fclean all

.PHONY:	all up down clean fclean re ref logs