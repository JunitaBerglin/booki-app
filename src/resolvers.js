const { GraphQLError } = require('graphql')
const axios = require('axios').default

exports.resolvers = {
	Query: {
		// getBookById: async (_, args) => {
		// 	// place the projectId the user sent in the variable called "projectId"
		// 	const bookId = args.bookId
		// 	try {
		// 		let response = await assertValidExecutionArguments.get(process.env.SHEETDB_URI)
		// 	} catch (error) {
		// 		console.log(error)
		// 		return new GraphQLError('hittar ej')
		// 	}

		// 	//read the book file; data will be returned as a JSON string
		// 	const bookData = await fsPromises.readfile(bookFilePath, { encoding: 'utf-8' })
		// 	//parse the returned JSON book data into a JS object
		// 	const data = JSON.parse(bookData)
		// 	//return the data
		// 	return data
		// },

		getAllBooks: async (_, args) => {
			let books = []
			try {
				let response = await axios.get(process.env.SHEETDB_URI)

				if (response.data.length > 0) {
					books = response.data
				}
			} catch (error) {
				console.log(error)
				return new GraphQLError('hittar ej')
			}
			console.log(books)
			return books
		},
	},
	Mutation: {
		createBook: (_) => null,
		updateBook: (_) => null,
		deleteBook: (_) => null,
	},
}
