import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Conditionally start the MSW worker
async function enableMocking() {

    if (process.env.NODE_ENV === 'development' || process.env.MOCKEDAPI) {
        // Dynamically import the worker to avoid bundling it in production
        const {worker} = await import('../mocks/browser');
        console.log("MSW worker started for API mocking.");

        return worker.start({
            onUnhandledRequest: 'warn' // 'bypass' allows unhandled requests to go to the network
            // 'warn' will log a warning for unhandled requests
            // 'error' will throw an error for unhandled requests
        });
    }

}
// await enableMocking();
createRoot(document.getElementById("root")!).render(<App />);
