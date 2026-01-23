describe("宣传资料", () => {
	let page
	beforeAll(async () => {
		page = await program.navigateTo('/views/pages/mine/material3?title=嗨丝&id=3')
	});
	it('图片预览功能', async () => {
		let url = "https://kankan-cdn.mdd3.cn/media/20240910/692066692009132032.jpg"
		let res = await page.callMethod('preview', url)
		expect(res).toBe(url);
	});
	it('资料下载功能', async () => {
		let item = {
			url: "https://kankan-cdn.mdd3.cn/media/20240910/692066692009132032.jpg",
			isDownLoad:false
		}
		let res = await page.callMethod('downLoad', item)
		await page.waitFor(5000)
		expect(item.isDownLoad).toBe(true);
	});

})