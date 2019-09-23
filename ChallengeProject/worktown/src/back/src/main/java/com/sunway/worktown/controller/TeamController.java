package com.sunway.worktown.controller;

import com.sunway.worktown.entity.MemberEntity;
import com.sunway.worktown.entity.TeamEntity;
import com.sunway.worktown.model.ResultModel;
import com.sunway.worktown.model.SearchResultModel;
import com.sunway.worktown.model.TeamMemberSearchInModel;
import com.sunway.worktown.service.TeamService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;

/**
 * 团队Controller
 *
 * @author malin
 * @version 1.0
 */
@Validated
@RestController
@RequestMapping("/team")
@Api(tags = "团队操作接口")
public class TeamController extends BaseEntityController<TeamEntity> {

    @Autowired
    private TeamService teamService;

    /**
     * 查询团队成员
     *
     * @param code 团队编码
     * @return 查询结果信息
     */
    @GetMapping("/{code}/members")
    @ApiOperation(value = "查询团队成员")
    public ResultModel<SearchResultModel<MemberEntity>> getMembers(
            @ApiParam(value = "团队编码", required = true) @PathVariable @NotNull(message = "code不能为空！") String code,
            @ApiParam(value = "查询团队成员的输入信息") @Validated TeamMemberSearchInModel searchInfo) {
        searchInfo.setTeamCode(code);
        return ResultModel.normal(teamService.searchMembers(searchInfo));
    }
}
