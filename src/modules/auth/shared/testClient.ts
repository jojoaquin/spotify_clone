export const registerMutation = (u: string, e: string, p: string) => `
mutation {
register(username: "${u}", email: "${e}", password: "${p}") {
        errors {
        message
        path
        }
        success
    }
}
`;

export const loginMutation = (e: string, p: string) => `
mutation {
login(email: "${e}", password: "${p}") {
        errors {
        message
        path
        }
        success
    }
}
`;
