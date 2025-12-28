package org.example.techmaastudentportal.dto;


import lombok.Data;

@Data
public class ResponseDTO<T> {
    private String message;
    private T data;

    public ResponseDTO(String message, T data){
        this.message= message;
        this.data= data;
    }

}
