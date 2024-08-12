const BASE_URL = "http://localhost:3000"

function App() {
    let isAuthenticated
    let user

    function logout() {
        m.request({
            url: `${BASE_URL}/auth/logout`,
            withCredentials: true,
        })
            .then(() => {
                isAuthenticated = false
                user = {}
            })
    }

    return {
        oninit: () => {
            m.request({
                url: `${BASE_URL}/auth/status`,
                withCredentials: true,
            })
                .then(res => {
                    user = res
                    isAuthenticated = res.loggedIn
                })
        },
        view: () => {
            return [
                isAuthenticated
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
                            m("img", {
                                referrerPolicy: "no-referrer",
                                src: user.photo,
                                width: 100,
                                height: 100,
                            }),
                            m("div", {
                                style: {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.25rem",
                                }
                            }, [
                                m("h2", `Hola, ${user.name}`),
                                m("h3", {
                                    style: {
                                        color: "hsla(0, 0%, 45%, 1)",
                                        fontWeight: "500"
                                    }
                                }, `${user.email}`),
                            ]),
                        ]),
                        m("button", {
                            onclick: () => {
                                logout()
                            },
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
                        m("h2", "Login"),
                        m("button", {
                            onclick: () => {
                                window.location = `${BASE_URL}/auth/login`
                            },
                            style: {
                                display: "block",
                                width: "100%",
                                padding: "0.25rem",
                            }
                        }, "Iniciar Sesión con Google")
                    ])
            ]
        }
    }
}

m.mount(document.getElementById("app"), App)
