GoogleAuth = {
    isAuthenticated: false
}

const App = {
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
                    m("button", {}, "Iniciar Sesión con Google")
                ])
        ]
    }
}

m.mount(document.getElementById("app"), App)
