export interface CheckUser {
    type: string,
    data: {
        message: string,
        userExists: boolean
    },
    success: boolean
}