import React from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../utils/userAuth';

interface LoginState {
  wrongEmail: boolean;
  emptyPassword: boolean;
  success: boolean;
}

export default class Login extends React.Component<LoginState> {
  static contextType = AuthContext;

  state: LoginState = {
    wrongEmail: false,
    emptyPassword: false,
    success: false
  }

  private email = React.createRef<HTMLInputElement>();
  private password = React.createRef<HTMLInputElement>();

  componentDidMount() {
    if (this.context.isAuthenticated) {
      this.setState({ success: true });
    }
  }

  onClick(): void {
    let failFlag: boolean = false;

    const inputEmail = this.email.current?.value || '';
    const inputPassword = this.password.current?.value || '';

    if (!inputPassword) {
      this.setState({ emptyPassword: true });
      failFlag = true;
    }
    else if (!this.context.login(inputEmail, inputPassword)) {
      this.setState({ wrongEmail: true });
      if (failFlag) return;
    }
    else {
      this.setState({ success: true });
    }
  }

  logOut(): void {
    this.context.logout();
    this.setState({ success: false });
  }

  render() {
    return (
      <div className="h-screen flex justify-center items-center bg-green-700 text-black">
        {this.state.success ?
          (
            <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md bg-white"
              role="alert">
              <div className="flex">
                <div className="py-1">
                  <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20">
                    <path
                      d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">You are already logged in</p>
                  <p className="text-sm">You can now access <Link to="/forecast"
                    className="text-blue-300 hover:text-blue-500">forecast
                    page</Link></p>
                  <p className="text-sm">or go straight <Link to="/" className="text-blue-300 hover:text-blue-500">back
                    home</Link></p>
                  <button onClick={this.logOut.bind(this)}
                    className="rounded-full bg-red-900 text-white w-56 my-7 py-4 font-bold">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <form className="h-80 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
              <div className="mb-4">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                  Email
                </label>
                <input className={`shadow appearance-none border ${this.state.wrongEmail ?
                  'border-red-500' :
                  ''} rounded w-full py-2 px-3 text-grey-darker mb-3`} id="username" type="email"
                  placeholder="username@example.com" ref={this.email} onFocus={() => this.setState({ wrongEmail: false })} />
                {this.state.wrongEmail && <p className="text-red-500 text-xs italic">Wrong email</p>}
              </div>
              <div className="mb-6">
                <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input className={`shadow appearance-none border ${this.state.emptyPassword ?
                  'border-red-500' :
                  ''} rounded w-full py-2 px-3 text-black mb-3`} id="password" type="password"
                  placeholder="******************" ref={this.password} onFocus={() => this.setState({ emptyPassword: false })} />
                {this.state.emptyPassword && <p className="text-red-500 text-xs italic">Empty password</p>}
              </div>
              <div className="flex items-center justify-center">
                <button className="rounded-full bg-red-900 text-white w-56 my-7 py-4 font-bold"
                  type="button" onClick={this.onClick.bind(this)}>
                  Sign In
                </button>
              </div>
            </form>
          )
        }
      </div>
    );
  }
}