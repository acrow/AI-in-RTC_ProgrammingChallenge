package com.sunway.worktown.controller;

import com.sunway.worktown.entity.BaseEntity;
import com.sunway.worktown.model.ResultModel;
import com.sunway.worktown.service.BaseRepositoryService;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

/**
 * 基础实体信息Controller
 *
 * @author malin
 * @version 1.0
 */
public abstract class BaseEntityController<T extends BaseEntity> extends BaseController {

    /**
     * 基础仓库Service
     */
    @Autowired
    BaseRepositoryService<T> service;

    /**
     * 添加信息
     *
     * @param entity 实体信息
     * @return 实体信息
     */
    @PostMapping("")
    @ApiOperation(value = "添加信息")
    public ResultModel<T> add(
            @ApiParam(value = "实体信息") @RequestBody @Validated T entity) {
        return ResultModel.normal(service.add(entity));
    }

    /**
     * 修改信息
     *
     * @param code   实体信息编码
     * @param entity 实体信息
     * @return 实体信息
     */
    @PutMapping("/{code}")
    @ApiOperation(value = "修改信息")
    public ResultModel<T> modify(
            @ApiParam(value = "实体信息编码", required = true) @PathVariable @NotNull(message = "code不能为空！") String code,
            @ApiParam(value = "实体信息") @RequestBody @Validated T entity) {
        entity.setCode(code);
        return ResultModel.normal(service.modify(entity));
    }

    /**
     * 删除信息
     *
     * @param code 实体信息编码
     */
    @DeleteMapping("/{code}")
    @ApiOperation(value = "删除信息")
    public void delete(
            @ApiParam(value = "实体信息编码", required = true) @PathVariable @NotNull(message = "code不能为空！") String code) {
        service.delete(code);
    }

    /**
     * 根据编码取得实体信息
     *
     * @param code 实体信息编码
     * @return 实体信息
     */
    @GetMapping("/{code}")
    @ApiOperation(value = "根据编码取得实体信息")
    public ResultModel<T> getByCode(
            @ApiParam(value = "实体信息编码", required = true) @PathVariable @NotNull(message = "code不能为空！") String code) {
        return ResultModel.normal(service.getByCode(code));
    }
}
