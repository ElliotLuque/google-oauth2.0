const GoogleAuth = {
    isAuthenticated: false,
    user: null,
    authenticate() {
        const authUrl = encodeURI(`https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=profile email`)
        window.location = authUrl
    },
    async fetchUserProfile(token) {
        try {
            const res = await m.request({
                method: "GET",
                url: "https://www.googleapis.com/oauth2/v2/userinfo?alt=json",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            this.isAuthenticated = true
            this.user = res
            m.redraw()
        } catch (error) {
            console.error("Error fetching user profile", error)
        }
    },
    logout() {
        this.isAuthenticated = false
        this.user = null
        window.localStorage.removeItem('auth_token')
        m.redraw()
    },
}

const App = {
    oninit: () => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const token = hashParams.get("access_token")

        if (token) {
            window.localStorage.setItem('auth_token', token)
            window.location.hash = ''
            GoogleAuth.fetchUserProfile(token)
        } else {
            const savedToken = window.localStorage.getItem('auth_token')
            if (savedToken) {
                GoogleAuth.fetchUserProfile(savedToken)
            }
        }
    },
    view: () => {
        return [
            GoogleAuth.isAuthenticated
                ? m("div", {
                    style: {
                        maxWidth: "fit-content",
                        padding: "0.75rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }
                }, [
                    m("div", {
                        style: {
                            display: "flex",
                            gap: "1rem",
                        }
                    }, [

                        m("img", { src: GoogleAuth.user.picture, width: 100, height: 100 }),
                        m("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.25rem",
                            }
                        }, [
                            m("h2", `Hola, ${GoogleAuth.user.name}`),
                            m("h3", {
                                style: {
                                    color: "hsla(0, 0%, 45%, 1)",
                                    fontWeight: "500"
                                }
                            }, `${GoogleAuth.user.email}`),
                        ]),
                    ]),
                    m("button", {
                        onclick: GoogleAuth.logout.bind(GoogleAuth),
                        style: {
                            display: "block",
                            width: "100%",
                            padding: "0.25rem",
                        }
                    }, "Cerrar Sesión")
                ])
                : m("div", {
                    style: {
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        maxWidth: "fit-content",
                    }
                }, [
                    m("h2", "Bienvenido"),
                    m("button", { onclick: GoogleAuth.authenticate.bind(GoogleAuth) }, "Iniciar Sesión con Google")
                ])
        ]
    }
}

m.mount(document.getElementById("app"), App)
