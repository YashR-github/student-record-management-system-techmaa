package org.example.techmaastudentportal.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class FormatUtil {
    public static String formatDateTime(){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy h:mm a");
        String formattedTime = LocalDateTime.now().format(formatter);
        //Remove spaces and invalid characters
        String safeFormattedTime= formattedTime.replace(" ","_").replace(":","-");
        return safeFormattedTime;
    }
}
