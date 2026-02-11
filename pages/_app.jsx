import "../styles/globals.css";
import AssistantWidget from "../components/AssistantWidget";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <AssistantWidget />
    </>
  );
}
