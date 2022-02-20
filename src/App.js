import "./App.css";
import { ErrorBoundary } from "./ErrorBoundry";

function App() {
  return (
    <div className="App w-full h-screen">
      <ErrorBoundary>
        <div className="lg:flex">
          <div className="lg:shrink-0 w-full lg:w-3/5 lg:flex items-center justify-center lg:h-screen bg-yellow-300 py-8 lg:py-0">
            <div
              className="m-auto flex items-center justify-center border-8 border-zinc-100"
              style={{ width: "640px", height: "480px", background: "white" }}
            >
              <p className="italic text-gray-900">
                ...loading hand detection model...
              </p>
            </div>
          </div>
          <div className="m-8">
            <h1 className="text-left font-bold text-4xl mb-2">
              The Human Synthesizer
            </h1>
            <p className="text-left">
              This is a virtual musical instrument based very loosely on the
              classic analogue{" "}
              <a
                className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                href="https://en.wikipedia.org/wiki/Theremin"
              >
                Theremin
              </a>
              , invented by Leon Theremin just under 100 years ago. Rather than
              using the proximity effect of the original this instrument works
              by using AI to detect hand motion, where the horizontal axis
              represents pitch and the vertical axis represents amplitude.
            </p>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default App;
