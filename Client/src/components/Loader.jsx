import { Loader2 } from "lucide-react"

export const LoaderX = ( Flag ) => {
    if (Flag) {
        return (
            <div>
                <Loader2/>
            </div>
        )
    }
}

export default LoaderX;