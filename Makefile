.PHONY: new publish serve build

new: ## 新建草稿: make new NAME="My Post"
	@test -n "$(NAME)" || { echo '用法: make new NAME="标题"'; exit 1; }
	./scripts/new $(NAME)

publish: ## 发布草稿: make publish（交互选择）；make publish ARGS=--all
	./scripts/publish $(ARGS)

serve: ## 本地预览
	zola serve

build: ## 构建到 public/
	zola build
