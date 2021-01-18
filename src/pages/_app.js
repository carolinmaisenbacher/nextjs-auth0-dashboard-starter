import App from 'next/app';

export default class MyApp extends App {
  constructor(props) {
    super(props);
    this.state = {
      user: props.pageProps.user,
      accessToken: props.accessToken
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    const props = {
      ...pageProps,
      user: this.state.user,
      accessToken: this.state.accessToken
    };
    return <Component {...props} />;
  }
}
