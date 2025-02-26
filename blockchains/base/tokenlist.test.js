const fs = require('fs')
const { isAddress } = require('viem')
const path = require('path')

describe('Tokenlist Validation', () => {
	let tokenlist

	beforeAll(() => {
		const data = fs.readFileSync(__dirname + '/tokenlist.json')
		tokenlist = JSON.parse(data)
	})

	test('each item in tokenlist should have valid properties', () => {
		tokenlist.forEach((token) => {
			expect(typeof token.name).toBe('string')
			expect(typeof token.symbol).toBe('string')
			expect(typeof token.decimals).toBe('number')
			expect(token.decimals).toBeGreaterThan(0)
			expect(token.decimals).toBeLessThanOrEqual(18)
			expect(isAddress(token.address)).toBe(true)
		})
	})

	test('each token should have a corresponding folder and info.json file', () => {
		tokenlist.forEach((token) => {
			const assetDir = path.join(__dirname, 'assets', token.address)
			const infoFilePath = path.join(assetDir, 'info.json')
			const logoFilePath = path.join(assetDir, 'logo.png')

			expect(fs.existsSync(assetDir)).toBe(true)

			expect(fs.existsSync(infoFilePath)).toBe(true)

			expect(fs.existsSync(logoFilePath)).toBe(true)

			const infoData = JSON.parse(fs.readFileSync(infoFilePath))

			expect(infoData).toHaveProperty('name', token.name)
			expect(infoData).toHaveProperty('symbol', token.symbol)
			expect(infoData).toHaveProperty('type', 'ERC20')
			expect(infoData).toHaveProperty('decimals', token.decimals)
			expect(infoData).toHaveProperty('id', token.address)
		})
	})
})
