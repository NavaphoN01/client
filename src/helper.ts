
export const storeUser = (data:any) => {
    localStorage.setItem(
        'user', 
        JSON.stringify({
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            Avatar: data.user.Avatar,
            Age: data.user.Age,
            Gender: data.user.Gender,
            tel: data.user.tel,
            description: data.user.description,
            createdAt:data.user.createdAt,
            jwt: data.jwt,
        })
    )
}

export const userData = () => {
    const stringfiedUser = localStorage.getItem('user') || ""
    if (stringfiedUser) {
        return JSON.parse(stringfiedUser)
    }
    return false
}