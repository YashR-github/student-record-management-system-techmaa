package org.example.techmaastudentportal.util;

import java.security.SecureRandom;

public class OtpUtil {
    private static final SecureRandom secureRandom = new SecureRandom();
    private static final int OTP_LENGTH=6;
    public static String generateRandomOTP(){
        int min = (int)Math.pow(10,OTP_LENGTH-1);
        int max= (int) Math.pow(10,OTP_LENGTH);
        int otp = min+ secureRandom.nextInt(max-min);
        return String.format("%0"+OTP_LENGTH + "d" ,otp);
    }
}
