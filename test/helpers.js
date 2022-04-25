module.exports = {
	getTmeStamp: async function(bn) {
		return (
			await ethers.provider.getBlock(bn)
		).timestamp
	},


	delay: function (ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}

