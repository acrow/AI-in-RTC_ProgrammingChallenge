package com.sunway.worktown.entity;

import com.sunway.worktown.annotation.Unique;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;

/**
 * 团队信息
 *
 * @author malin
 * @version 1.0
 */
@Entity
@Table(name = "team")
@ApiModel(value = "团队信息")
public class TeamEntity extends BaseEntity {

    /**
     * serialVersionUID
     */
    private final static long serialVersionUID = -1740361593280251642L;

    /**
     * 编码
     */
    @Unique(name = "编码")
    @NotBlank(message = "code不能为空！")
    @Column(name = "code", nullable = false, length = 64)
    @ApiModelProperty(value = "编码")
    private String code;

    /**
     * 名称
     */
    @NotBlank(message = "name不能为空！")
    @Column(name = "name", nullable = false, length = 64)
    @ApiModelProperty(value = "名称")
    private String name;

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
}
