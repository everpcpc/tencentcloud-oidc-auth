default: build

init:
	pnpm install

build: init
	pnpm run build
