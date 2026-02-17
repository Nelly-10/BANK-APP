import { Button } from "./ui/button";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {


    return (
        <>
            {variant === "primary" ? (
                <Button
                    onClick={() => open()}
                    // disabled={!ready}
                    >
                    Connect bank
                </Button>
            ) : variant === "ghost"

            }
        </>
    )
}

export default PlaidLink;