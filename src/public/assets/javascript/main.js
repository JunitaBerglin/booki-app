const searchButton = document.getElementById('search_button')

const graphQlQuery = async (url, query, variables = {}) => {
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	})

	const res = await response.json()
	return res.data
}

let allBooks = []

const getAllBooksQuery = `query getAllBooks {
    getAllBooks {
      author
      category
      grade
      id
      title
    }
  }`

searchButton.addEventListener('click', async () => {
	getAllBooksFronend()
})

async function getAllBooksFronend() {
	const response = await graphQlQuery('http://localhost:5001/graphql', getAllBooksQuery)

	console.log(response)

	allBooks = response.getAllBooks

	console.log(allBooks)

	createHTML(allBooks)
}

function createHTML(allBooks) {
	let allBooksList = document.getElementById('allBooksList')
	allBooksList.innerHTML = ''

	for (let i = 0; i < allBooks.length; i++) {
		let bookContainer = document.createElement('div')
		let bookTitle = document.createElement('h5')
		let bookAuthor = document.createElement('h5')
		let bookCategory = document.createElement('h6')
		let bookGrade = document.createElement('h6')

		bookContainer.classList.add('book')
		bookTitle.classList.add('book__title')
		bookGrade.classList.add('book__grade')

		bookTitle.innerHTML = allBooks[i].title
		bookAuthor.innerHTML = allBooks[i].author
		bookCategory.innerHTML = allBooks[i].category
		bookGrade.innerHTML = allBooks[i].grade

		bookContainer.appendChild(bookTitle)
		bookContainer.appendChild(bookAuthor)
		bookContainer.appendChild(bookCategory)
		bookContainer.appendChild(bookGrade)
		allBooksList.appendChild(bookContainer)
	}
}
createHTML(allBooks)
