
export const trimModelAttributes = (model: any) => {
	Object.keys(model.dataValues).forEach((key: any) => {
		if (typeof model.dataValues[key] === 'string') {
			model.dataValues[key] = model.dataValues[key].trim()
		}
	})

	return JSON.parse(JSON.stringify(model))
}

export const generateNumber = () => {
	const randomID = Math.floor(Math.random() * 100)
	return randomID
}

export const generateReference = (length: any) => {
	const referenceID = new Date().getTime().toString().slice(-length)
	return referenceID
}



