import { CircularProgress, CircularProgressProps } from "@material-ui/core";

export type LoadingProps = {} & CircularProgressProps;

export default function Loading(props: LoadingProps) {
    return <CircularProgress color="secondary" size={40} {...props} />;
}
