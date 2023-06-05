import puppeteer from "puppeteer"
import fetch from "node-fetch"
import path from "path"
import fs from "fs"

async function takeScreenshot(url: string, outputFilePath: string): Promise<void> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setViewport({width: 1920, height: 1080})
    await page.goto(url, {waitUntil: "networkidle0"})
    await autoScroll(page)
    await page.screenshot({path: outputFilePath})
    await browser.close()
}

async function autoScroll(page: any) {
    await page.evaluate(async () => {
        await new Promise<void>(resolve => {
            let totalHeight = 0
            const distance = 100
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight
                window.scrollBy(0, distance)
                totalHeight += distance

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer)
                    resolve()
                }
            }, 100)
        })
    })
}

async function main(): Promise<void> {
    const websiteList: string[] = ["URLs hier einfügen"]

    const iCloudDriveFolderPath: string = path.join(process.env.HOME!, "Library/Mobile Documents/com~apple~CloudDocs")

    const outputFolderName: string = "Schreibtisch"
    const outputFolderPath: string = path.join(iCloudDriveFolderPath, outputFolderName)

    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath)
    }

    for (const website of websiteList) {
        const websiteName: string = website.replace(/\//g, "_")
        const outputFilePath: string = path.join(outputFolderPath, `${websiteName}.png`)

        await takeScreenshot(website, outputFilePath)
        console.log(`Screenshot saved to ${outputFilePath}`)
    }
}

main()
