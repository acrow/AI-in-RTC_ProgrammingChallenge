package com.sunway.worktown.model;

import io.swagger.annotations.ApiModel;

/**
 * 查询团队成员的输入信息
 *
 * @author malin
 * @version 1.0
 */
@ApiModel("查询团队成员的输入信息")
public class TeamMemberSearchInModel extends SearchModel {

    /**
     * 团队编码
     */
    private String teamCode;

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }
}
