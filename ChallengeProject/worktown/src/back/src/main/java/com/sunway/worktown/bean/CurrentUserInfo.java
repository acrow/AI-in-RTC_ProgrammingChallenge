package com.sunway.worktown.bean;

/**
 * 当前用户信息
 *
 * @author malin
 * @version 1.0
 */
public class CurrentUserInfo {

    /**
     * 登录名
     */
    private String userName;

    /**
     * 编码
     */
    private String code;

    /**
     * 姓名
     */
    private String name;

    /**
     * 团队编码
     */
    private String teamCode;

    /**
     * 团队中的位置
     */
    private Integer orderIndex;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTeamCode() {
        return teamCode;
    }

    public void setTeamCode(String teamCode) {
        this.teamCode = teamCode;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}
