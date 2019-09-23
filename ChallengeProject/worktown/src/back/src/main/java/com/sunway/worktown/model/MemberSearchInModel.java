package com.sunway.worktown.model;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * 查询用户的输入信息
 *
 * @author malin
 * @version 1.0
 */
@ApiModel("查询用户的输入信息")
public class MemberSearchInModel extends SearchModel {

    /**
     * 登录名
     */
    @ApiModelProperty(value = "登录名")
    private String userName;

    /**
     * 团队编码
     */
    @ApiModelProperty(value = "团队编码")
    private String teamCode;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }
}
