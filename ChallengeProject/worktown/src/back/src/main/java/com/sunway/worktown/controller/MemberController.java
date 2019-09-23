package com.sunway.worktown.controller;

import com.sunway.worktown.entity.MemberEntity;
import com.sunway.worktown.model.MemberSearchInModel;
import com.sunway.worktown.model.ResultModel;
import com.sunway.worktown.model.SearchResultModel;
import com.sunway.worktown.service.MemberService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户Controller
 *
 * @author malin
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping("/member")
@Api(tags = "用户操作接口")
public class MemberController extends BaseEntityController<MemberEntity> {

    /**
     * 用户Service
     */
    @Autowired
    private MemberService memberService;

    /**
     * 根据查询用户的输入信息取得实体信息
     *
     * @param searchInfo 查询用户的输入信息
     * @return 查询结果信息
     */
    @GetMapping("")
    @ApiOperation(value = "根据查询信息取得患者信息")
    public ResultModel<SearchResultModel<MemberEntity>> search(
            @ApiParam(value = "查询用户的输入信息") @Validated MemberSearchInModel searchInfo) {
        return ResultModel.normal(memberService.search(searchInfo));
    }
}
