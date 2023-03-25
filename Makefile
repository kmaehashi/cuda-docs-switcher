.PHONY: all
all:
	rm -rf dist
	mkdir dist
	cp -a src/* dist/
	cp -a static/* dist/
