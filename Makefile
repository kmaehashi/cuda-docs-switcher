.PHONY: all
all:
	rm -rf dist
	mkdir dist
	cp -a src/* dist/
	cp -a static/* dist/
	cp -a LICENSE dist/

.PHONY: release
release: all
	rm cuda-docs-switcher-dist.zip
	zip -r cuda-docs-switcher-dist.zip dist/
	@echo "*** Upload the ZIP to the Chrome Web Store."
	@echo "*** MAKE SURE YOU BUMPED THE VERSION NUMBER!"
	@grep -F '"version":' src/manifest.json

.PHONY: test
test: all
	npx playwright test
	# Alternate Options:
	# npx playwright test --ui
	# npx playwright test --debug
