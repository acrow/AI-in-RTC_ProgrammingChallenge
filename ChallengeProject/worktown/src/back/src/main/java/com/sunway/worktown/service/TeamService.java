package com.sunway.worktown.service;

import com.sunway.worktown.entity.MemberEntity;
import com.sunway.worktown.entity.TeamEntity;
import com.sunway.worktown.model.MemberSearchInModel;
import com.sunway.worktown.model.SearchResultModel;
import com.sunway.worktown.model.TeamMemberSearchInModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 团队Service
 *
 * @author malin
 * @version 1.0
 */
@Service
public class TeamService extends BaseRepositoryService<TeamEntity> {

    /**
     * 用户Service
     */
    @Autowired
    private MemberService memberService;

    /**
     * 查询团队成员
     *
     * @param searchInfo 查询团队成员的输入信息
     * @return 查询结果信息
     */
    public SearchResultModel<MemberEntity> searchMembers(TeamMemberSearchInModel searchInfo) {
        return memberService.search(createSearchInfo(MemberSearchInModel.class, searchInfo));
    }
}
