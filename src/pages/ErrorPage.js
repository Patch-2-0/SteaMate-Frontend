import { useSearchParams } from "react-router-dom";

const ErrorPage = () => {
    const [searchParams] = useSearchParams();
    const error = searchParams.get("error");

    let message = "알 수 없는 오류가 발생했습니다.";
    if (error === "인증 시간이 만료되었습니다. 다시 회원가입해주세요.") 
        message = "인증 시간이 만료되었습니다. 다시 회원가입해주세요.";
    if (error === "유효하지 않은 토큰입니다.") 
        message = "유효하지 않은 인증 링크입니다.";
    if (error === "잘못된 요청입니다.") 
        message = "요청을 처리하는 중 오류가 발생했습니다.";
    if (error === "이미 인증된 계정입니다.") 
        message = "이미 인증된 계정입니다.";

    return (
        <div>
            <h2>오류 발생</h2>
            <p>{message}</p>
        </div>
    );
};

export default ErrorPage;
