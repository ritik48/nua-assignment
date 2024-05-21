import { Form, Link } from "react-router-dom";

function Login() {
    const errors = {};
    return (
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
            <Link
                to="/"
                className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
            >
                <img
                    className="mr-2 h-8 w-8"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                    alt="logo"
                />
                Poll s.
            </Link>
            <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                    {errors?.credentials && (
                        <p className="py-2 text-center text-sm font-medium text-red-500">
                            🔴 Incorrect credentials
                        </p>
                    )}
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <Form
                        method="POST"
                        className="space-y-4 md:space-y-6"
                        replace
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="focus:border-1 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 outline-none transition-all duration-300 focus:border-[#ff5e2e] focus:ring-blue-800 sm:text-sm"
                                placeholder="name@company.com"
                                required=""
                            />
                            {errors?.email && (
                                <p className="py-1 text-sm font-medium text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="focus:border-1 mb-2 block text-sm font-medium text-gray-900 outline-none transition-all duration-300 focus:border-[#ff5e2e] dark:text-white"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="focus:border-1 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 outline-none transition-all duration-300 focus:border-[#ff5e2e] focus:ring-blue-800 sm:text-sm"
                                required=""
                            />
                            {errors?.password && (
                                <p className="py-1 text-sm font-medium text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 w-full rounded-lg bg-[#ff5e2e] px-5 py-2.5 text-center text-sm font-medium text-white ring-offset-2 hover:bg-[#ed6749] focus:outline-none focus:ring-2 focus:ring-orange-300"
                        >
                            Log in
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account yet?{" "}
                            <Link
                                to={"/signup"}
                                className="dark:text-primary-500 font-medium text-[#ff5e2e] hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export { Login };
