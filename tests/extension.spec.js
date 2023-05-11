import { chromium } from "@playwright/test";
import path from "path";

import { test, expect } from '@playwright/test'

test.describe('Test extension load', () => {
  test('Load CUDA documentation website', async () => {
    const browserContext = await createBrowserContext()
    const page = await browserContext.newPage()
    await page.goto('https://docs.nvidia.com/cuda/')

    expect(page.getByText('CUDA Toolkit Documentation')).toBeVisible()

    browserContext.close()
  })
})

export const createBrowserContext = async () => {
  // assuming your extension is built to the 'public' directory
  const userDataDir = '/tmp/test-user-data-dir'
  const browserContext = await chromium.launchPersistentContext(
    userDataDir,
    {
      headless: false,
      args: [`--disable-extensions-except=${__dirname}/../dist`],
      ignoreDefaultArgs: ['--disable-component-extensions-with-background-pages'],
    }
  )
  return browserContext
}
