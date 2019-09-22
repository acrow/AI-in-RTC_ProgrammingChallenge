package com.sunway.worktown.controller;

import com.sunway.worktown.entity.MemberEntity;
import com.sunway.worktown.model.ResultModel;
import com.sunway.worktown.model.SearchResultModel;
import com.sunway.worktown.service.MemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/member")
@Api(tags = "用户操作接口")
@Validated
@RestController
public class MemberController extends BaseEntityController<MemberEntity> {
    /**
     * 根据用户登录名获取用户列表
     *
     * @param loginName 用户登录名
     * @return 用户列表
     */
    @GetMapping
    @ApiOperation(value = "根据用户登录名获取用户列表")
    public ResultModel queryByLoginName(
            @ApiParam(value = "用户登录名", required = true)  @Validated String loginName) {
        SearchResultModel<MemberEntity> result = new SearchResultModel<>();

        result.setItems(((MemberService)service).queryByLoginName(loginName));
        return ResultModel.normal(result);
    }
}
