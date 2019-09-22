package com.sunway.worktown.controller;

import com.sunway.worktown.entity.TeamEntity;
import io.swagger.annotations.Api;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/team")
@Api(tags = "团队操作接口")
@Validated
@RestController
public class TeamController extends BaseEntityController<TeamEntity> {

}
