package com.sunway.worktown.controller;

import com.sunway.worktown.model.TxFRInModel;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import static com.sunway.worktown.util.EncryptUtils.getMD5;

@RestController
public class HelloController {

    @PostMapping("/hello")
    public String proxyTxFR(@RequestBody TxFRInModel inModel) throws IOException, NoSuchAlgorithmException {
        CloseableHttpClient client = HttpClients.createDefault();
//        HttpPost httpPost = new HttpPost("https://api.ai.qq.com/fcgi-bin/face/face_getgroupids");
        HttpPost httpPost = new HttpPost(inModel.getUrl());
        List<NameValuePair> params = new ArrayList<>();
        Map<String, String> reqParas = inModel.getReqParas();
        if (Objects.nonNull(reqParas)) {
            reqParas.forEach((k, v) -> params.add(new BasicNameValuePair(k, v)));
        }

        params.add(new BasicNameValuePair("app_id", "2121189674"));
        params.add(new BasicNameValuePair("time_stamp", String.valueOf(System.currentTimeMillis() / 1000)));
        params.add(new BasicNameValuePair("nonce_str", RandomStringUtils.randomAlphanumeric(17)));

        params.add(new BasicNameValuePair("sign", getReqSign(params)));

        httpPost.setEntity(new UrlEncodedFormEntity(params));

        CloseableHttpResponse response = client.execute(httpPost);

        final HttpEntity entity = response.getEntity();
        return EntityUtils.toString(entity);
    }

    private String getReqSign(List<NameValuePair> params) throws UnsupportedEncodingException, NoSuchAlgorithmException {

        params.sort(Comparator.comparing(NameValuePair::getName));
        StringBuilder sb = new StringBuilder();
        for (NameValuePair para : params) {
            if (sb.length() > 0) {
                sb.append("&");
            }
            sb.append(para.getName()).append("=")
                    .append(URLEncoder.encode(para.getValue(), StandardCharsets.UTF_8.toString()));
        }
        sb.append("&app_key=hz8ujcHHTyDmIJQT");

        return StringUtils.upperCase(getMD5(sb.toString()));

    }
}
