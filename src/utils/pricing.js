// Single source of truth for order pricing. The storefront mirrors these rules
// (bookshop-client/src/lib/pricing.js) only to preview totals; the order is
// always priced here.
const STANDARD_SHIPPING_FEE = 25000
const FREESHIP_THRESHOLD = 150000

const VOUCHERS = {
	BOOK10K: { code: 'BOOK10K', type: 'amount', value: 10000 },
	FREESHIP: { code: 'FREESHIP', type: 'shipping' },
}

const findVoucher = (code) => {
	if (typeof code !== 'string') return null
	return VOUCHERS[code.trim().toUpperCase()] || null
}

// itemsValue: sum of line totals after book discounts
const priceOrder = (itemsValue, voucherCode) => {
	const voucher = findVoucher(voucherCode)
	const freeShip = itemsValue >= FREESHIP_THRESHOLD || voucher?.type === 'shipping'
	const shipFee = freeShip ? 0 : STANDARD_SHIPPING_FEE
	const voucherDiscount = voucher?.type === 'amount' ? Math.min(itemsValue, voucher.value) : 0
	return {
		voucher: voucher?.code || null,
		shipFee,
		voucherDiscount,
		total: Math.max(0, itemsValue - voucherDiscount + shipFee),
	}
}

module.exports = { STANDARD_SHIPPING_FEE, FREESHIP_THRESHOLD, VOUCHERS, findVoucher, priceOrder }
