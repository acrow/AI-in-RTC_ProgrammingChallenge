package com.sunway.worktown.controller;

import com.sunway.worktown.model.ResultModel;
import com.sunway.worktown.model.TencentApiModel;
import com.sunway.worktown.util.TencentApiUtil;
import io.swagger.annotations.Api;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
import java.util.*;

import static com.sunway.worktown.util.EncryptUtils.getMD5;

@RestController
@RequestMapping("/proxy")
@Api(tags = "代理接口")
public class ProxyController extends BaseController {

    @PostMapping("/tencent")
    public ResultModel<String> apiTencent(@RequestBody TencentApiModel inModel) throws IOException, NoSuchAlgorithmException {
        final HttpEntity entity = TencentApiUtil.exec(inModel);
        return ResultModel.normal(EntityUtils.toString(entity));
    }

    @PostMapping("/login")
    public ResultModel<String> loginByTencentFace(@RequestBody String img) throws IOException, NoSuchAlgorithmException {
        TencentApiModel inModel = new TencentApiModel();
        inModel.setUrl("https://api.ai.qq.com/fcgi-bin/face/face_faceidentify");
        Map<String, String> paras = new HashMap<>();
        paras.put("image", img);
        paras.put("group_id", "group0");
        paras.put("topn", "1");
        inModel.setParas(paras);
        final HttpEntity entity = TencentApiUtil.exec(inModel);
        return ResultModel.normal(EntityUtils.toString(entity));
    }
}
