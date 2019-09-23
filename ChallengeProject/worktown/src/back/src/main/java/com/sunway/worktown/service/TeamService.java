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

    @Override
    public void delete(String code) {
        // 删除团队信息
        super.delete(code);

        // 更新用户信息
        TeamMemberSearchInModel searchInfo = new TeamMemberSearchInModel();
        searchInfo.setTeamCode(code);
        searchMembers(searchInfo).getItems().forEach(member -> {
            member.setTeamCode(null);
            member.setOrderIndex(null);
            memberService.modify(member);
        });
    }

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
