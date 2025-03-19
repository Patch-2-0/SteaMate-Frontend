import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL;

const VerifyEmail = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const hasFetched = useRef(false); // ✅ 첫 실행 여부 확인

    useEffect(() => {
        const verifyEmail = async () => {
            if (!uidb64 || !token) {
                console.error("🚨 UID 또는 Token이 없음!");
                alert("잘못된 요청입니다.");
                navigate("/error?error=bad-request");
                return;
            }

            if (hasFetched.current) return; // ✅ 중복 실행 방지
            hasFetched.current = true; // ✅ 첫 실행 후 true로 변경

            try {
                const response = await fetch(`${BASE_URL}/account/verify-email/${uidb64}/${token}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const responseData = await response.json();
                console.log("🔍 서버 응답:", responseData);

                if (response.ok && responseData.success) {
                    alert("이메일 인증이 완료되었습니다! 🎉");
                    navigate("/", { replace: true }); // 인증 성공 시 홈으로 이동
                } else {
                    const errorParam = responseData.error ? encodeURIComponent(responseData.error) : "bad-request";
                    alert(`오류: ${responseData.error}`);
                    navigate(`/error?error=${errorParam}`, { replace: true });
                }
            } catch (error) {
                console.error("🚨 서버 요청 중 오류 발생:", error);
                alert("서버 오류가 발생했습니다.");
                navigate("/error?error=server-error", { replace: true });
            }
        };

        verifyEmail();
    }, [uidb64, token, navigate]);

    return <p>이메일 인증 중...</p>;
};

export default VerifyEmail;
