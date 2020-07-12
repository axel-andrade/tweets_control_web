const formatSearchQueryParam = searchText => {
    if(searchText && typeof searchText === 'string'){
        if(searchText.startsWith('#')){
            searchText = searchText.substr(1)
            return `hashtag=${searchText}`
        }
    }
    return `text=${searchText}`
}

export { formatSearchQueryParam }
