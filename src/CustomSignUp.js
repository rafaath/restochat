import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";

export default function CustomSignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("phoneNumber");

  if (!isLoaded) {
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (step === "phoneNumber") {
      try {
        await signUp.create({
          phoneNumber,
          firstName: name,
        });
        await signUp.preparePhoneNumberVerification();
        setStep("verificationCode");
      } catch (err) {
        console.error("Error: ", err.message);
      }
    } else {
      try {
        const completeSignUp = await signUp.attemptPhoneNumberVerification({
          code: verificationCode,
        });
        if (completeSignUp.status !== "complete") {
          console.log(JSON.stringify(completeSignUp, null, 2));
        } else {
          await setActive({ session: completeSignUp.createdSessionId });
        }
      } catch (err) {
        console.error("Error: ", err.message);
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {step === "phoneNumber" && (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </>
        )}
        {step === "verificationCode" && (
          <div>
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
        )}
        <button type="submit">
          {step === "phoneNumber" ? "Sign Up" : "Verify"}
        </button>
      </form>
    </div>
  );
}