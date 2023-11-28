import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { localKeys } from 'src/app/core/constants/localStorage.keys';
import { urlConstants } from 'src/app/core/constants/urlConstants';
import { HttpService, LocalStorageService, ToastService, UserService } from 'src/app/core/services';
import { SessionService } from 'src/app/core/services/session/session.service';
import { CommonRoutes } from 'src/global.routes';

@Component({
  selector: 'app-mentor-details',
  templateUrl: './mentor-details.page.html',
  styleUrls: ['./mentor-details.page.scss'],
})
export class MentorDetailsPage implements OnInit {
  mentorId;
  public headerConfig: any = {
    backButton: true,
    headerColor: "primary"
  };

  public buttonConfig = {
    meta : { 
      id: null
    },
    buttons: [
      {
        label: "SHARE_PROFILE",
        action: "share",
      }
    ]
  }

  detailData = {
    form: [
      {
        title: 'ABOUT',
        key: 'about',
      },
      {
        title: "DESIGNATION",
        key: "designation"
      },
      {
        title: 'YEAR_OF_EXPERIENCE',
        key: 'experience',
      },
      {
        title: 'KEY_AREAS_OF_EXPERTISE',
        key: 'area_of_expertise',
      },
      {
        title: "EDUCATION_QUALIFICATION",
        key: "education_qualification"
      },
      {
        title: "LANGUAGES",
        key: "languages" 
      },
      {
        title: "ORGANIZATION",
        key: "organizationName"
      },
    ],
    data: {
      rating: {
        average:0
      },
      sessions_hosted:0 ,
      organizationName:""
    },
  };
  segmentValue = "about";
  upcomingSessions;
  constructor(
    private routerParams: ActivatedRoute,
    private httpService: HttpService,
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private localStorage:LocalStorageService,
    private toast:ToastService
  ) {
    routerParams.params.subscribe(params => {
      this.mentorId = this.buttonConfig.meta.id = params.id;
      this.userService.getUserValue().then(async (result) => {
        if (result) {
          this.getMentor();
        } else {
          this.router.navigate([`/${CommonRoutes.AUTH}/${CommonRoutes.LOGIN}`], { queryParams: { mentorId: this.mentorId } })
        }
      })
    })
  }

  ngOnInit() {
  }
  async ionViewWillEnter(){
    this.upcomingSessions = await this.sessionService.getUpcomingSessions(this.mentorId);
  }
  async getMentor() {
    let user = await this.localStorage.getLocalData(localKeys.USER_DETAILS);
    // this.mentorId=user._id;
    const config = {
      url: urlConstants.API_URLS.MENTORS_PROFILE_DETAILS + this.mentorId,
      payload: {}
    };
    try {
      let data: any = await this.httpService.get(config);
      this.detailData.data = data.result;
      this.detailData.data.organizationName = data.result.organization.name;
    }
    catch (error) {
    }
  }

  goToHome() {
    this.router.navigate([`/${CommonRoutes.TABS}/${CommonRoutes.HOME}`]);
  }

  async segmentChanged(ev: any) {
    this.segmentValue = ev.detail.value;
    this.upcomingSessions = (this.segmentValue == "upcoming") ? await this.sessionService.getUpcomingSessions(this.mentorId) : [];
  }
  async onAction(event){
    switch (event.type) {
      case 'cardSelect':
        this.router.navigate([`/${CommonRoutes.SESSIONS_DETAILS}/${event.data.id}`]);
        break;

      case 'joinAction':
        await this.sessionService.joinSession(event.data);
        this.upcomingSessions = await this.sessionService.getUpcomingSessions(this.mentorId);
        break;

        case 'enrollAction':
        let enrollResult = await this.sessionService.enrollSession(event.data.id);
        if(enrollResult.result){
          this.toast.showToast(enrollResult.message, "success")
          this.upcomingSessions = await this.sessionService.getUpcomingSessions(this.mentorId);
        }
        break;
    }
  }
}
