export interface PostUser {
    username: string,
    password: string
}

export interface RegisterUser {
    username: string,
    password: string,
    email: string
}

export interface Notice {
    title: string,
    beginDate: Date,
    endDate: Date,
    color: string,
    description: string,
}
